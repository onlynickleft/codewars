// A famous casino is suddenly faced with a sharp decline of their revenues. They decide to offer Texas hold'em also online. Can you help them by writing an algorithm that can rank poker hands?

// Task
// Create a poker hand that has a method to compare itself to another poker hand:

// PokerHand.prototype.compareWith = function(hand){...};
// A poker hand has a constructor that accepts a string containing 5 cards:

// var hand = new PokerHand("KS 2H 5C JD TD");
// The characteristics of the string of cards are:

// Each card consists of two characters, where
// The first character is the value of the card: 2, 3, 4, 5, 6, 7, 8, 9, T(en), J(ack), Q(ueen), K(ing), A(ce)
// The second character represents the suit: S(pades), H(earts), D(iamonds), C(lubs)
// A space is used as card separator between cards
// The result of your poker hand compare can be one of these 3 options:

// var Result = 
// {
//     "win": 1,
//     "loss": 2,
//     "tie": 3
// }
// Notes
// Apply the Texas Hold'em rules for ranking the cards.
// Low aces are valid in this kata.
// There is no ranking for the suits.
//
// My solution

let Result = { "win": 1, "loss": 2, "tie": 3 };
const CARDS = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, T: 10, J: 11, Q: 12, K: 13, A: 14 };
const HAND_TYPES = { 'RF': 10, 'SF': 9, 'FK': 8, 'FH': 7, 'FL': 6, 'ST': 5, 'TK': 4, 'TP': 3, 'OP': 2, 'HC': 1 };
const ROYAL_FLUSH_TOTAL = 60;

function PokerHand(hand) {
  this.hand = hand;
}

PokerHand.prototype.compareWith = function (hand) {
  let pHand = this.hand,
    oHand = hand.hand,
    pHandType = getHandType(pHand).type,
    oHandType = getHandType(oHand).type,
    pCards = getHandType(pHand).cards,
    oCards = getHandType(oHand).cards;

  // Win on type of hand alone
  if (HAND_TYPES[pHandType] > HAND_TYPES[oHandType])
    return Result.win;
  else if (HAND_TYPES[pHandType] < HAND_TYPES[oHandType])
    return Result.loss;
  else {
    return getHighCard(pCards, oCards);
  }
}

function getHighCard(pCards, oCards) {
  let lowAceStraightP = isLowAceStraight(getCardValues(pCards.split('').join(' '))),
      lowAceStraightO = isLowAceStraight(getCardValues(oCards.split('').join(' ')));
  pCards = lowAceStraightP ? lowAceStraightP : pCards.split('');
  oCards = lowAceStraightO ? lowAceStraightO : oCards.split('');
  
  for (let i = 0; i < pCards.length; i++) {
    let pValue = CARDS[pCards[i]],
      oValue = CARDS[oCards[i]];
    
    if (pValue > oValue)
      return Result.win;
    else if (pValue < oValue)
      return Result.loss;
  }
  return Result.tie;
}

function getHandType(hand) {
  let cards = getCardValuesString(hand);

  if (isRoyalFlush(hand))
    return { type: 'RF', cards: cards };
  else if (isStraightFlush(hand))
    return { type: 'SF', cards: cards };
  else if (isFlush(hand))
    return { type: 'FL', cards: cards };
  else if (isStraight(hand))
    return { type: 'ST', cards: cards };
  return remainingTypes(hand);
}

function remainingTypes(hand) {
  let cards = getCardValuesString(hand);

  // 4 of a kind
  if (/(.)\1{3}/.test(cards))
    return { type: 'FK', cards: cards }
  // Full house
  else if (/^(.)\1{1}(.)\2{2}|(.)\3{2}(.)\4{1}$/.test(cards))
    return { type: 'FH', cards: cards }
  // 3 of a kind
  else if (/(.)\1{2}/.test(cards))
    return { type: 'TK', cards: cards };
  // Two pair
  else if (/(.)\1{1}.*(.)\2{1}/.test(cards))
    return { type: 'TP', cards: cards };
  // Pair
  else if (/(.)\1{1}/.test(cards))
    return { type: 'OP', cards: cards };
  else
    return { type: 'HC', cards: cards };
}

function getCardValues(hand) {
  return hand
    .split(' ')
    .map(value => !!CARDS[value[0]] ? CARDS[value[0]] : CARDS[value]);
}

function getCardValuesString(hand) {
  let values = getCardValues(hand).sort((a, b) => b - a),
    strValues = [];

  values.forEach(value => {
    strValues.push(Object.keys(CARDS).find(key => CARDS[key] === value));
  });
  return strValues.toString().replace(/,/g, '');
}

function getCardSuits(hand) {
  return hand
    .split(' ')
    .map(suit => suit[1]);
}

function isLowAceStraight(values) {
  if (values.join('') === '234514' || values.join('') === '145432'){
    return [1, 2, 3, 4, 5];
  }
  return false;
}

function isStraight(hand) {
  let values = getCardValues(hand).sort((a, b) => a - b),
    isStr = true,
    lowAceStraight = isLowAceStraight(values);
  
  values = !!lowAceStraight ? lowAceStraight : values;
  
  for (let i = 0; i < values.length; i++) {
    let value = values[i],
      nextValue = values[i + 1];

    if (nextValue) {
      if ((value + 1) !== nextValue) {
        isStr = false;
        break;
      }
    }
  }
  return isStr;
}

function isFlush(hand) {
  return getCardSuits(hand).every((suit, i, arr) => suit === arr[0]);
}

function isStraightFlush(hand) {
  return isStraight(hand) && isFlush(hand);
}

function isRoyalFlush(hand) {
  let isRF = (getCardValues(hand).reduce((acc, curr) => acc + curr) === ROYAL_FLUSH_TOTAL);
  return isStraight(hand) && isFlush(hand) && isRF;
}