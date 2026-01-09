import { visit } from 'unist-util-visit';

export function remarkGithubAdmonitions() {
  return (tree) => {
    visit(tree, 'blockquote', (node, index, parent) => {
      const children = node.children;
      if (!children || children.length === 0) return;

      const firstChild = children[0];
      if (firstChild.type !== 'paragraph') return;

      const firstTextNode = firstChild.children[0];
      if (!firstTextNode || firstTextNode.type !== 'text') return;

      const text = firstTextNode.value;
      // Match [!TYPE] at the start of the text, allowing for optional whitespace
      const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);

      if (match) {
        const type = match[1].toLowerCase();
        
        // Remove the [!TYPE] text
        let newFirstTextValue = text.slice(match[0].length);
        
        // If there's a newline or space immediately after, trim it
        if (newFirstTextValue.startsWith('\n') || newFirstTextValue.startsWith(' ')) {
            newFirstTextValue = newFirstTextValue.slice(1);
        }

        // Update the text node
        firstTextNode.value = newFirstTextValue;
        
        // If the first paragraph becomes empty (just whitespace), remove it
        if (newFirstTextValue.trim() === '' && firstChild.children.length === 1) {
             node.children.shift();
        }

        // Transform the node to containerDirective
        node.type = 'containerDirective';
        node.name = type;
        node.attributes = {};
        
        // Ensure data exists
        node.data = node.data || {};
      }
    });
  };
}
