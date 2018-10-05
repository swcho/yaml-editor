
import * as React from 'react';
import * as monaco from 'monaco-editor';

export class YamlEditor extends React.Component<YamlEditor.Props> {
  private root: HTMLDivElement | null;
  render() {
    return (
      <div {...this.props} ref={ref => this.root = ref}>
      </div>
    );
  }

  componentDidMount() {
    if (this.root) {
      const {
        options,
      } = this.props;
      monaco.editor.create(this.root, {
        language: 'yaml',
        ...options,
      });
    }
  }
}

export namespace YamlEditor {
  export type Props = {
    options?: monaco.editor.IEditorConstructionOptions;
  } & Pick<React.HTMLAttributes<HTMLDivElement>, "style">;
}
