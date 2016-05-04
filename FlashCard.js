/**
 * This class defines the schema for FlashCard.
 */
'use strict';

const Realm = require('realm');

class FlashCard {}

FlashCard.schema = {
  name: 'FlashCard',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: {type: 'string', optional: true},
    description: {type: 'string', optional: true},
    imageUrl: {type: 'string', optional: true},
    videoUrl: {type: 'string', optional: true},
  }
}

module.exports = FlashCard;
