const test = require('ava');
const Mahjong = require('../');

test('Mahjong#constructor', t => {
  const yama = Mahjong.generateYama();
  const pais = ['東', '南', '西', '北', '白', '発', '中', '一萬', '二萬', '三萬', '四萬', '五萬', '六萬', '七萬'];
  const discardedPais = [];
  const doraDisplayedPais = ['東'];

  pais.forEach(pai => {
    yama.splice(yama.indexOf(pai), 1);
  });

  doraDisplayedPais.forEach(pai => {
    yama.splice(yama.indexOf(pai), 1);
  });

  const mahjong = new Mahjong({
    yama,
    pais,
    discardedPais,
    doraDisplayedPais
  });

  t.is(mahjong.display(), '\n\n🀫🀫🀀🀫🀫🀫🀫\n\n🀀🀁🀂🀃🀄🀆🀇🀈🀉🀊🀋🀌 🀍');
  t.is(mahjong.pais.length, pais.length);
  t.is(mahjong.discardedPais.length, discardedPais.length);
  t.is(mahjong.yama.length + mahjong.pais.length + mahjong.discardedPais.length + mahjong.doraDisplayedPais.length, 136);

  mahjong.discard('南');
  t.is(mahjong.sutehai, '🀁');

  mahjong.discard('西');
  t.is(mahjong.sutehai, '🀁🀂');
  t.is(mahjong.discardedPais.length, 2);
  t.is(mahjong.yama.length + mahjong.pais.length + mahjong.discardedPais.length + mahjong.doraDisplayedPais.length, 136);
});

test('Mahjong#discard', t => {
  const mahjong = Mahjong.haipai();
  t.is(mahjong.sutehai, '');
  t.is(mahjong.discardedPais.length, 0);

  const discardedPais = [];
  const count = 3;
  let i = count;
  while (i--) {
    const random = Math.floor(Math.random() * mahjong.pais.length + 1);
    const selectedPai = mahjong.pais[random];
    mahjong.discard(selectedPai);
  }
  t.is(mahjong.discardedPais.length, count);
});

test('Mahjong#tsumogiri', t => {
  const mahjong = Mahjong.haipai();
  t.is(mahjong.sutehai, '');
  t.is(mahjong.discardedPais.length, 0);

  const count = 10;
  let i = count;
  while (i--) {
    mahjong.tsumogiri();
  }
  t.is(mahjong.discardedPais.length, count);
});

test('Mahjong.generateYama', t => {
  const yama = Mahjong.generateYama();
  t.is(yama.length, 136);
});

test('Mahjong.haipai', t => {
  const mahjong = Mahjong.haipai();
  t.is(mahjong.pais.length, 14);
  t.is(mahjong.discardedPais.length, 0);
  t.is(mahjong.yama.length, 121);
  t.is(mahjong.doraDisplayedPais.length, 1);
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
