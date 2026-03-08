import { visit } from 'unist-util-visit';

export function remarkAdmonitions() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (!['note', 'tip', 'warning', 'danger', 'info', 'important', 'caution'].includes(node.name)) {
          return;
        }

        const data = node.data || (node.data = {});
        const tagName = 'div';
        
        data.hName = tagName;
        data.hProperties = {
          'data-admonition': node.name,
          className: `admonition admonition-${node.name}`
        };
      } else if (node.type === 'paragraph') {
        // Fallback for markdown processors not parsing directives correctly
        if (node.children && node.children.length > 0 && node.children[0].type === 'text') {
          const text = node.children[0].value;
          const match = text.match(/^::: *(note|tip|warning|danger|info|important|caution)/i);
          if (match) {
            const type = match[1].toLowerCase();
            const data = node.data || (node.data = {});
            data.hName = 'div';
            data.hProperties = {
              'data-admonition': type,
              className: `admonition admonition-${type}`
            };
            
            // Remove the :::type from the text
            node.children[0].value = text.replace(/^::: *(note|tip|warning|danger|info|important|caution)\s*/i, '');
            
            // Check if last child ends with :::
            const lastChild = node.children[node.children.length - 1];
            if (lastChild.type === 'text' && lastChild.value.match(/:::$/)) {
              lastChild.value = lastChild.value.replace(/:::$/, '');
            }
          }
        }
      }
    });
  };
}
