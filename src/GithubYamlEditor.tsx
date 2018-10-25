
import * as React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { YamlEditor } from './YamlEditor';
import { getAccessToken, githubApi, contents } from './github';

function parseQuery<T>(search: string): T {
  // search = search || window.location.search; // tslint:disable-line
  if (search === '') {
    return {} as any;
  }
  const query = search.substring(1);
  const vars = query.split('&');
  const ret: any = {};
  for (let i = 0; i < vars.length; i += 1) {
    const [key, value] = vars[i].split('=');
    ret[decodeURIComponent(key)] = value ? decodeURIComponent(value) : true ;
  }
  return ret;
}

export class GithubYamlEditor extends React.Component<GithubYamlEditor.Props, {
  token: string | null;
  content: contents.Item | null;
}> {
  constructor(props: GithubYamlEditor.Props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      content: null,
    };
  }

  private editor: YamlEditor | null;
  render() {
    const {
      token,
      content,
    } = this.state;
    console.log(content)
    return (
      <div>
        <p>Token:
          <input
            type="text"
            value={token || ''}
            onChange={
              (e) => {
                const token = e.target.value;
                localStorage.setItem('token', token);
                this.setState({ token });
              }
            }
          />
        </p>
        {content && (
          <YamlEditor
            ref={ref => this.editor = ref}
            style={{ height: 200 }}
            options={{
              value: atob(content.content),
            }}
          />
        )}
        {/* <button
          onClick={
            () => {
              console.log(location.href);
              const url = getAuthorizeUrl(location.href);
              console.log(url);
              // location.href = url;
            }
          }
        >Go</button> */}
        <button
          onClick={
            async () => {
              if (this.editor && content && token) {
                const value = this.editor.getValue();
                const {
                  repoFullName,
                  contentPath,
                } = this.props;
                const {
                  sha,
                } = content;
                githubApi({ token }).repos(repoFullName).contents(contentPath).update({
                  sha,
                  message: 'From YamlEditor',
                  content: btoa(value),
                });
              }
            }
          }
        >Update</button>
      </div>
    );
  }

  async componentDidMount() {
    const {
      repoFullName,
      contentPath,
    } = this.props;
    const {
      token,
    } = this.state;
    if (token) {
      const content = await githubApi({ token }).repos(repoFullName).contents(contentPath).get();
      this.setState({ content })
    }
  }
}

export namespace GithubYamlEditor {
  export type Props = {
    repoFullName: string;
    contentPath: string;
  };
}
