import test from 'ava';
import { stub } from 'sinon';
import { lerp } from './math';
import { TetikusException } from '@/exceptions/TetikusException';

test('should return correct result', t => {
  const result = lerp(20, 80, 0.5);

  t.is(result, 50);
});

test('should be able to parse pixel format', t => {
  const result = lerp('20px', '80px', 0.5);

  t.is(result, 50);
});

test('should be able to parse rem format', t => {
  const result = lerp('1.25rem', '5rem', 0.5);

  t.is(result, 50);
});

test('should throw an error if format is unknown', t => {
  const consoleSpy = stub(console, 'error');

  t.throws(() => {
    lerp('1em', '2em', 0.1);
  }, { instanceOf: TetikusException });

  t.is(consoleSpy.callCount, 1);
  consoleSpy.restore();
});