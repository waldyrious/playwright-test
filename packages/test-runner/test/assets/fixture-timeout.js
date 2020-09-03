/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { it, expect, registerFixture } = require('../../');

registerFixture('timeout', async ({}, runTest) => {
  await runTest();
  await new Promise(f => setTimeout(f, 100000));
});

it('fixture timeout', async ({timeout}) => {
  expect(1).toBe(1);
});

it('failing fixture timeout', async ({timeout}) => {
  expect(1).toBe(2);
});