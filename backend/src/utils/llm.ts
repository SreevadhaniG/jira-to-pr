export function cleanLLMResponse(
  response: string,
): string {
  return response
    .replace(/```json/g, "")
    .replace(/```typescript/g, "")
    .replace(/```ts/g, "")
    .replace(/```javascript/g, "")
    .replace(/```js/g, "")
    .replace(/```/g, "")
    .trim();
}