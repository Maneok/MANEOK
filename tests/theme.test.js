const fs = require('fs');

function getUpdateHistoryState() {
  const content = fs.readFileSync(require('path').join(__dirname, '../assets/theme.js'), 'utf8');
  const match = content.match(/_updateHistoryState: function\(variant\) {([\s\S]*?)\n\s*},/);
  if (!match) throw new Error('Function not found');
  return new Function('variant', match[1]);
}

test('_updateHistoryState updates window.history with variant id', () => {
  const updateHistoryState = getUpdateHistoryState();
  const replaceState = jest.fn();
  global.history = { replaceState };
  global.window = {
    location: { protocol: 'https:', host: 'example.com', pathname: '/product' },
    history: { replaceState }
  };

  updateHistoryState({ id: 42 });

  expect(replaceState).toHaveBeenCalledWith(
    { path: 'https://example.com/product?variant=42' },
    '',
    'https://example.com/product?variant=42'
  );
});
