
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

  private editor: monaco.editor.IStandaloneCodeEditor;
  componentDidMount() {
    if (this.root) {
      const {
        options,
      } = this.props;
      this.editor = monaco.editor.create(this.root, {
        language: 'yaml',
        ...options,
      });
    }
  }

  getValue() {
    return this.editor.getValue();
  }
}

export namespace YamlEditor {
  export type Props = {
    options?: monaco.editor.IEditorConstructionOptions;
  } & Pick<React.HTMLAttributes<HTMLDivElement>, "style">;
}
