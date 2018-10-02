// import React from 'react';
// import { storiesOf } from '@storybook/react';
// // import { action } from '@storybook/addon-actions';

// storiesOf('Button', module)
//   .add('with text', () => (
//     <div></div>
//   ))
//   ;  

import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
// import { action } from "@storybook/addon-actions";
// import TicTacToeCell from "./TicTacToeCell";

const stories = storiesOf("Components", module);

// stories.add(
//     "TicTacToeCell",
//     withInfo({ inline: true })(() => <TicTacToeCell value="X" position={{ x: 0, y: 0 }} onClick={action("onClick")} />)
//   );
stories.add(
  "TicTacToeCell",
  withInfo({ inline: true })(() => <div></div>)
);