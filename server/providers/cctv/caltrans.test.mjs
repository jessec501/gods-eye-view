import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caltransFeed, parseCaltransAnchors } from './sources.js';

const STILL =
  'https://cwwp2.dot.ca.gov/data/d8/cctv/image/sr9147sr71/sr9147sr71.jpg';

test('caltransFeed uses the official HLS stream when one is given', () => {
  const stream = 'https://wzmedia.dot.ca.gov/D8/LB-8_91_47.stream/playlist.m3u8';
  assert.deepEqual(caltransFeed(STILL, stream), {
    feedType: 'hls',
    url: stream,
    snapshotUrl: STILL,
  });
});

test('caltransFeed stays a still without a stream or with a foreign one', () => {
  const still = { feedType: 'image', url: STILL, snapshotUrl: STILL };
  assert.deepEqual(caltransFeed(STILL, null), still);
  assert.deepEqual(caltransFeed(STILL, ''), still);
  assert.deepEqual(
    caltransFeed(STILL, 'https://evil.example/D8/x.stream/playlist.m3u8'),
    still,
  );
  assert.deepEqual(
    caltransFeed(STILL, 'http://wzmedia.dot.ca.gov/D8/x.stream/playlist.m3u8'),
    still,
  );
  assert.deepEqual(
    caltransFeed(STILL, 'https://wzmedia.dot.ca.gov/D8/x.stream/manifest.mpd'),
    still,
  );
});

test('parseCaltransAnchors keeps California points and drops junk', () => {
  assert.deepEqual(
    parseCaltransAnchors('33.8804,-117.5473; 33.8836 , -117.6386'),
    [
      { lat: 33.8804, lon: -117.5473 },
      { lat: 33.8836, lon: -117.6386 },
    ],
  );
  assert.deepEqual(parseCaltransAnchors(undefined), []);
  assert.deepEqual(parseCaltransAnchors(''), []);
  assert.deepEqual(parseCaltransAnchors('40.7,-74.0;abc;33.9'), []);
});
