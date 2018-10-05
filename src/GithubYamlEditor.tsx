
import * as React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { YamlEditor } from './YamlEditor';
// import Github = require('@octokit/rest');

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const BASE='https://github.com';

function getAuthorizeUrl(callbackUrl: string) {
  return `${BASE}/login/oauth/authorize?\
client_id=${CLIENT_ID}\
&client_secret=${CLIENT_SECRET}\
&type=user_agent&\
redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

function getAccessToken(code: string, callbackUrl: string) {
  return `${BASE}/login/oauth/access_token?\
client_id=${CLIENT_ID}\
&client_secret=${CLIENT_SECRET}\
&type=user_agent&\
&code=${code}&\
redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

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

type Content = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  // _links: ReposUpdateFileResponseContentLinks;
}

export class GithubYamlEditor extends React.Component<GithubYamlEditor.Props, {
  token: string | null;
  content: Content | null;
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
              if (this.editor && content) {
                const config: AxiosRequestConfig = {
                  headers: {
                    'Authorization': `token ${token}`
                  }
                };
                const value = this.editor.getValue();
                console.log(value);
                const {
                  sha,
                } = content;
                await axios.put(
                  'https://api.github.com/repos/swcho/ex_k8s/contents/kubia-rc.yaml',
                  {
                    sha,
                    message: 'From YamlEditor',
                    content: btoa(value),
                  },
                  config).then(resp => resp.data);
                // const content = await axios.get<Content>('https://api.github.com/repos/swcho/ex_k8s/contents/kubia-rc.yaml', config).then(resp => resp.data);
                // this.setState({ content })
              }
            }
          }
        >Update</button>
      </div>
    );
  }

  async componentDidMount() {
    const {
      token,
    } = this.state;
    const query = parseQuery<{ code: string }>(location.search);
    const code = query.code;
    console.log({ code });
    if (code && !token) {
      try {
        const resp = await axios.post(getAccessToken(code, location.href)).then(resp => resp.data);
        console.log(resp);
      } catch(e) {
        console.error(e)
      }
    }
    if (token) {
      const config: AxiosRequestConfig = {
        headers: {
          'Authorization': `token ${token}`
        }
      };
      const content = await axios.get<Content>('https://api.github.com/repos/swcho/ex_k8s/contents/kubia-rc.yaml', config).then(resp => resp.data);
      this.setState({ content })
      console.log(content);
    }
  }
}

export namespace GithubYamlEditor {
  export type Props = {
  };
}
