const test = require('ava');
const Mahjong = require('../mahjong');

test('Mahjong#constructor', t => {
  const yama = Mahjong.generateYama();
  const pais = ['東', '南', '西', '北', '白', '発', '中', '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬'];
  const discardedPais = [];
  const doraDisplayedPai = '東';

  pais.forEach(pai => {
    yama.splice(yama.indexOf(pai), 1);
  });

  if (yama.includes(doraDisplayedPai)) {
    yama.splice(yama.indexOf(doraDisplayedPai), 1);
  }

  const mahjong = new Mahjong({
    yama,
    pais,
    discardedPais,
    doraDisplayedPai
  });

  t.is(mahjong.display(), '\n\n🀫🀫🀀🀫🀫🀫🀫\n\n🀀🀁🀂🀃🀄🀆🀇🀈🀉🀊🀋🀌 🀍');
  t.is(mahjong.pais.length, pais.length);
  t.is(mahjong.discardedPais.length, discardedPais.length);
  t.is(mahjong.yama.length + mahjong.pais.length + mahjong.discardedPais.length + 1, 136);

  mahjong.discard('南');
  t.is(mahjong.sutehai, '🀁');

  mahjong.discard('西');
  t.is(mahjong.sutehai, '🀁🀂');
  t.is(mahjong.discardedPais.length, 2);
  t.is(mahjong.yama.length + mahjong.pais.length + mahjong.discardedPais.length + 1, 136);

  [...Array(16).keys()].forEach(() => mahjong.tsumogiri());
  t.is(mahjong.discardedPais.length, 18);
  t.is(mahjong.wanpai, '🀫🀫🀀🀫🀫🀫🀫');
  t.is(mahjong.pais.length, 14);
});

test('Mahjong.generateYama()', t => {
  const yama = Mahjong.generateYama();
  t.is(yama.length, 136);
});

test('Mahjong.haipai', t => {
  const mahjong = Mahjong.haipai();
  t.is(mahjong.pais.length, 14);
  t.is(mahjong.discardedPais.length, 0);
  t.is(mahjong.yama.length, 121);
  t.true(Boolean(mahjong.doraDisplayedPai));
  t.true(Boolean(mahjong.display()));
});

test('Mahjong.getPaiCodePointFrom', t => {
  t.is(Mahjong.getPaiCodePointFrom('東'), '🀀');
  t.is(Mahjong.getPaiCodePointFrom('南'), '🀁');
  t.is(Mahjong.getPaiCodePointFrom('西'), '🀂');
  t.is(Mahjong.getPaiCodePointFrom('北'), '🀃');
  t.is(Mahjong.getPaiCodePointFrom('白'), '🀆');
  t.is(Mahjong.getPaiCodePointFrom('發'), '🀅');
  t.is(Mahjong.getPaiCodePointFrom('中'), '🀄');
});

test('Mahjong.TSUMOGIRI', t => {
  t.is(Mahjong.parseCommand('t').type, Mahjong.TSUMOGIRI);
});

test('Mahjong.normalizePai', t => {
  t.is(Mahjong.normalizePai('ton'), '東');
  t.is(Mahjong.normalizePai('tonn'), '東');
  t.is(Mahjong.normalizePai('nan'), '南');
  t.is(Mahjong.normalizePai('発'), '發');
  t.is(Mahjong.normalizePai('発'), '發');
  t.is(Mahjong.normalizePai('1m'), '一萬');
  t.is(Mahjong.normalizePai('1man'), '一萬');
  t.is(Mahjong.normalizePai('1まん'), '一萬');
  t.is(Mahjong.normalizePai('一まん'), '一萬');
  t.is(Mahjong.normalizePai('2s'), '二索');
  t.is(Mahjong.normalizePai('2sou'), '二索');
  t.is(Mahjong.normalizePai('2そう'), '二索');
  t.is(Mahjong.normalizePai('2ソウ'), '二索');
  t.is(Mahjong.normalizePai('3p'), '三筒');
  t.is(Mahjong.normalizePai('3pin'), '三筒');
  t.is(Mahjong.normalizePai('3ぴん'), '三筒');
  t.is(Mahjong.normalizePai('3ピン'), '三筒');
  t.is(Mahjong.normalizePai('3ピ'), null);
});
