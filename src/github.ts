import { AxiosRequestConfig } from "axios";
import axios from 'axios';

const CLIENT_ID = '';
const CLIENT_SECRET = '';
const BASE='https://github.com';

export function getAuthorizeUrl(callbackUrl: string) {
  return `${BASE}/login/oauth/authorize?\
client_id=${CLIENT_ID}\
&client_secret=${CLIENT_SECRET}\
&type=user_agent&\
redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

export function getAccessToken(code: string, callbackUrl: string) {
  return `${BASE}/login/oauth/access_token?\
client_id=${CLIENT_ID}\
&client_secret=${CLIENT_SECRET}\
&type=user_agent&\
&code=${code}&\
redirect_uri=${encodeURIComponent(callbackUrl)}`;
}

const BASE_API = 'https://api.github.com';

const trees = (url: string, config?: AxiosRequestConfig) => {
  const urlTrees = `${url}/trees`;
  const ret = (sha: string) => {
    const urlSha = `${urlTrees}/${sha}`;
    return axios.get(urlSha, config).then(r => r.data);
  };
  return ret;
};

export namespace contents {
  export type Links = {
    git: string;
    self: string;
    html: string;
  };
  export type Item = {
    type: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string;
    _links: Links;
  };

  export namespace create {
    export type User = {
      name: string;
      email: string;
    };
    export type Params = {
      message: string;
      content: string;
      branch?: string;
      committer?: User;
      author?: User;
    };

    export type Content = {
      name: string;
      path: string;
      sha: string;
      size: number;
      url: string;
      html_url: string;
      git_url: string;
      download_url: string;
      type: string;
      _links: Links;
    };

    export type Verification = {
      verified: boolean;
      reason: string;
      signature: null;
      payload: null;
    };
    export type Parent = {
      url: string;
      html_url: string;
      sha: string;
    };
    export type Tree = {
      url: string;
      sha: string;
    };
    export type Commiter = {
      date: string;
      name: string;
      email: string;
    };
    export type Author = {
      date: string;
      name: string;
      email: string;
    };
    export type Commit = {
      sha: string;
      node_id: string;
      url: string;
      html_url: string;
      author: Author;
      committer: Commiter;
      message: string;
      tree: Tree;
      parents: Parent[];
      verification: Verification;
    };

    export type Resp = {
      content: Content;
      commit: Commit;
    };
  }

  export namespace update {
    export type Params = {
      sha: string;
    } & create.Params;
  }

  export namespace del {
    export type Params = {
      path: string;
      message: string;
      sha: string;
      branch?: string;
    };
  }
}

const contents = (url: string, config?: AxiosRequestConfig) => {
  const urlContents = `${url}/contents`;
  const ret = (path: string) => {
    const urlPath = `${urlContents}${path}`;
    return {
      get: () => axios.get<contents.Item>(urlPath, config).then(r => r.data),
      create: (params: contents.create.Params) =>
        axios.put<contents.create.Resp>(urlPath, params, config).then(resp => resp.data),
      update: (params: contents.update.Params) =>
        axios.put<contents.create.Resp>(urlPath, params, config).then(resp => resp.data),
      del: (params: contents.update.Params) =>
        axios.delete(urlPath, { ...config, data: params }).then(resp => resp.data),
    };
  };
  return ret;
};

const repos = (url: string, config?: AxiosRequestConfig) => {
  const urlRepos = `${url}/repos`;
  const ret = (repoFullName: string) => {
    const urlRepo = `${urlRepos}/${repoFullName}`;
    return {
      trees: trees(urlRepo, config),
      contents: contents(urlRepo, config),
    }
  };
  return ret;
};

export const githubApi = (params: githubApi.Params) => {
  const {
    baseUrl = BASE_API,
    token,
  } = params;
  const config: AxiosRequestConfig = {
    headers: {
      'Authorization': `token ${token}`
    }
  };
  return {
    repos: repos(baseUrl, config),
  };
}

export namespace githubApi {
  export type Params = {
    baseUrl?: string;
    token: string;
  };
}
