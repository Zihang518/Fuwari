import re
import json
import os
## 123
def extract_friend_data(html_content):
    """从HTML内容中提取友链数据"""
    # 匹配友链卡片的正则表达式
    pattern = r'<a href="([^"]+)"[^>]*class="friend-card">\s*' \
             r'<div class="flex items-center gap-2">\s*' \
             r'<img src="([^"]+)"[^>]*>\s*' \
             r'<div class="font-bold[^"]*">([^<]+)</div>\s*' \
             r'</div>\s*' \
             r'<div class="text-sm[^"]*">([^<]+)</div>'
    
    friends = []
    for match in re.finditer(pattern, html_content, re.DOTALL):
        url, avatar, name, description = match.groups()
        friend = {
            "name": name.strip(),
            "avatar": avatar.strip(),
            "description": description.strip(),
            "url": url.strip()
        }
        friends.append(friend)
    return friends

def read_friends_astro():
    """读取friends.astro文件内容"""
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                            'src', 'pages', 'friends.astro')
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def read_existing_friends_json():
    """读取现有的friends.json文件内容"""
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                            'src', 'data', 'friends.json')
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"friends": []}

def write_friends_json(friends_data):
    """将友链数据写入friends.json文件"""
    file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                            'src', 'data', 'friends.json')
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(friends_data, f, ensure_ascii=False, indent=2)

def main():
    # 读取friends.astro内容
    astro_content = read_friends_astro()
    
    # 提取友链数据
    new_friends = extract_friend_data(astro_content)
    
    # 读取现有的friends.json
    existing_data = read_existing_friends_json()
    
    # 将新的友链数据添加到现有数据中
    # 使用URL作为唯一标识符，避免重复
    existing_urls = {friend["url"] for friend in existing_data["friends"]}
    for friend in new_friends:
        if friend["url"] not in existing_urls:
            existing_data["friends"].append(friend)
            existing_urls.add(friend["url"])
    
    # 写入更新后的数据
    write_friends_json(existing_data)
    print(f"成功提取并添加了 {len(new_friends)} 个友链数据")

if __name__ == "__main__":
    main()