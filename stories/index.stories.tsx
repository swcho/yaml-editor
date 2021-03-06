
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
// import { action } from "@storybook/addon-actions";
import { YamlEditor } from '../src/YamlEditor';
import { GithubYamlEditor } from '../src/GithubYamlEditor';

const stories = storiesOf("Components", module);

// stories.add(
//     "TicTacToeCell",
//     withInfo({ inline: true })(() => <TicTacToeCell value="X" position={{ x: 0, y: 0 }} onClick={action("onClick")} />)
//   );
stories
  .add(
    "YamlEditor",
    withInfo({ inline: true})(
      () =>
        <YamlEditor
          style={{ height: 200 }}
        />
    )
  )
  .add(
    "GithubYamlEditor",
    withInfo({ inline: true})(
      () =>
        <GithubYamlEditor
          repoFullName="swcho/ex_k8s"
          contentPath="/kubia-rc.yaml"
        />
    )
  )
;
