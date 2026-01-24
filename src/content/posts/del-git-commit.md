---
title: 如何让一个文件在Git提交中永远消失？如何丢掉其中一条提交并保持逻辑完整？
published: 2026-01-24T06:57:21
description: 我们有时候可能会误操作导致提交了一个不该提交的文件，当你发现的时候，在此之后已经堆砌了很多新的提交...
image: ../assets/images/del-git-commit-1.png
draft: false
lang: ""
---
# 引言
接简介

这个时候我们实际上是需要将那个错误提交的文件在所有Git提交上抹掉，并且逻辑自洽

当然，如果你不嫌麻烦或者仓库提交本来就很少，你可以一点点的手动重写Git提交历史。又或是将历史提交合并为一个提交，强制推送

但是，这些方法要不太磨人，要不不优雅

假设这个仓库有1000+提交又不想合并所有提交历史呢？

# 正式开始

有个PIP包正好可以满足我们的需求， **git-filter-repo** 

```bash
pip install git-filter-repo
```

安装后，进入你的Git仓库运行，接下来，我们只需要传一个文件路径给它即可

- **--path** 是传入的文件路径，可以是相对路径也可以是绝对路径。但是注意，要用 **/** 分割路径
- **--force** 是让它忽略安全性条件（如必须是一个刚克隆的仓库）
- **--invert-paths** 是反选路径，也就是 **剔除** 指定 **--path** 的文件

执行后它会查找该文件所在仓库的所有提交，并仅将该文件剔除，若某一提交中仅对该文件做了更改，则一整条提交直接消失（因为提交中无文件更改）；若某一提交中除了对该文件做了更改，还有其他文件，则该条提交仍然存在，但是文件变更记录中不再有该文件

```bash
git filter-repo --force --path src/secret.txt --invert-paths
```

比如这里我们一不小心提交了个 **微信密码** ，就可以用该命令剔除它

```bash
git filter-repo --force --path 微信密码.txt --invert-paths
```

![](../assets/images/del-git-commit-2.png)

![](../assets/images/del-git-commit-4.png)

可以看到，效果非常拔群， **微信密码.txt** 已经不翼而飞了

![](../assets/images/del-git-commit-3.png)

但是还有个问题，就是我们曾经的 **提交文本** 暴露了 **我们曾经曾上传过微信密码相关的文件** ，虽然实际上文件已经被剔除了

那有没有办法把这条提交删掉呢？有的，兄弟有的

我们可以使用原生的 **git rebase** ，以该提交作为 **基点** ，将后续提交接在该提交上，这样就可以 **架空** 该提交。宏观来看，我们就在Git仓库中从 **中间** 删除了一条提交

首先，我们需要获取该提交的 **哈希** ，这里假设为 **4e19d1fc6af5119cb33128a92d5d4e80fc42e6ef** （仅需前8位即可）

接下来，使用变基命令

```bash
git rebase --onto 4e19d1fc^ 4e19d1fc
```

这里会报错并自动中断变基进程，Git表示该提交有些文件和当前的提交冲突，无法自动解决冲突

![](../assets/images/del-git-commit-5.png)

由于我们要以当前提交为准，仅剔除中间的提交，所以我们使用该命令 **以当前提交为基准，解决所有文件的冲突** 

```bash
git checkout --theirs .
```

接下来将冲突标记为 **已解决** 
```bash
git add -A
```

![](../assets/images/del-git-commit-6.png)

继续变基进程

```bash
git rebase --continue
```

这里会弹出一个修改Git提交的vim，直接关掉即可。 **ESC** + **\:q** 

![](../assets/images/del-git-commit-7.png)

如果中途又停下来重复上面几步即可。最终，检查你的本地提交，确认要删除的提交已经不再存在。并且目前工作区的文件没有任何更改，仅更改了Git历史提交记录

![](../assets/images/del-git-commit-9.png)

最后，我们需要将本地仓库 **覆写** 到远程仓库，由于最开始的PIP包在命令执行完毕后会将远程仓库删除，我们此时需要重新添加回来

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
```

建立upstream并强制推送到远端

```bash
git push -u origin main -f
```

此时，大功告成。自此时起，所有用户都已经看不到那个你不想让别人看到的文件与提交记录了，就像它从未存在过