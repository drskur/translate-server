import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { TranslateServerStack } from "../src/stacks/translate-server-stack";

test("Snapshot", () => {
  const app = new App();
  const stack = new TranslateServerStack(app, "test");

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
