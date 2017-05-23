#!/usr/bin/env node
import _ from 'lodash';
import fs from 'fs';
var Combinatorics = require('js-combinatorics');

function EtherDream(){
  console.log('EtherDream');
  let rEmail = RuleSymbol('MAXIME;BEYNET@GMAIL;COM');
  let rEther = RuleOr(["ET", "ETHER", "ETHEREUM"]);
  let rWallet = RuleOr(["wallet", "WALLET"]);
  let rNum = RuleOr(["2", "02"])

  let rWalletNum = RuleAnd(rWallet, rNum);

  let seps = ['', '-', '_', ' '];
  let finalResult = _.flatten(_.map(seps, sep => {
    //let rSep = RuleSymbol(sep)
    let rSep = RuleOr(['', sep])
    let rCodes = RulesPermutation(["vt88q6s2", "yp3s532g", "Y@", "ET"], rSep);
    let rules = [rCodes, rEther, rWalletNum, rEmail]
    let rulesComb = Combinatorics.permutationCombination(rules).toArray();
    rulesComb = _.reject(rulesComb, rules => rules.length <= 4)
  //console.log('combination: ', permComb);
    let allCombinations = _.flatten(_.map(rulesComb, rules => {
        //console.log('rules: ', rules);
        return _.reduce(rules, (acc, rule, key) => applyRules(acc, rule, key < rules.length - 1 ? rSep : RuleSymbol('')), [''])
    }))

    return allCombinations;
  }))

  //console.log('#result ', finalResult.length);

  console.log(finalResult);
  //let finalResult = _.flatten(allCombinations)
  console.log('#result ', finalResult.length);
  writeToFile(finalResult)
}

function writeToFile(result){
    let content = _.reduce(result, (acc, item) => acc + item + '\n', '');
    fs.writeFileSync('password.txt', content);
}

function applyItems(rule, items){
  return _.flatten(_.map(items, item => rule.applyItem(item)));
}

function applyRules(block, ...rules){
  //console.log("rules: ", rules)
  return _.reduce(rules, (acc, rule) => applyItems(rule, acc), block)
}

function RuleSymbol(symbol){
  return {
    symbol,
     applyItem(item){
       //console.log('RuleSymbol applyItem:', item);
       return item + symbol
     }
  }
}
function RuleAnd(...rules){
  return {
     name: 'and',
     applyItem(item){
       //console.log('RuleAnd applyItem:', item);
       return _.reduce(rules, (acc, rule) => applyItems(rule, acc), [item])
     }
  }
}

function RuleOr(choices){
  return {
    choices,
     applyItem(item){
       return _.map(choices, blockItem => item + blockItem)
     }
  }
}

function RulesPermutation(itemsIn, seperator){
  let permComb = Combinatorics.permutationCombination(itemsIn).toArray();
  permComb = _.reject(permComb, combination => combination.length < 2);
  //console.log("RulesPermutation ", permComb);
  let allCombinations = _.flatten(_.map(permComb, items => {
    //console.log("items ", items);
      return _.reduce(items, (acc, item, key) => {
        //console.log("item %s, key %s, len %s, acc", item, key, items.length, acc);
        return applyRules(acc, RuleSymbol(item), key < items.length - 1 ? seperator : RuleSymbol(''))
      }, ['']);
  }))
  console.log(allCombinations);
  return {
    name: "permutation",
    applyItem(item){
      return _.map(allCombinations, combinations => item + combinations)
    }
  }
}

EtherDream()
