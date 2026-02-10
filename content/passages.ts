import { Passage, Level } from '@/types';

// Placeholder passages - to be replaced with real public domain content
const level1Passages: Passage[] = [
  { id: 'l1-01', level: 1, title: 'The Cat', content: 'The cat sat on the mat. The cat is fat.', hasAudio: true },
  { id: 'l1-02', level: 1, title: 'A Dog', content: 'A dog ran in the park. The dog is happy.', hasAudio: true },
  { id: 'l1-03', level: 1, title: 'The Sun', content: 'The sun is hot. It shines all day long.', hasAudio: true },
  { id: 'l1-04', level: 1, title: 'My Hat', content: 'I have a red hat. It fits on my head.', hasAudio: true },
  { id: 'l1-05', level: 1, title: 'The Frog', content: 'A frog can hop. It hops on a log.', hasAudio: true },
  { id: 'l1-06', level: 1, title: 'A Cup', content: 'I drink from a cup. The cup has water.', hasAudio: true },
  { id: 'l1-07', level: 1, title: 'The Bird', content: 'A bird can fly. It has two wings.', hasAudio: true },
  { id: 'l1-08', level: 1, title: 'My Bed', content: 'I sleep in my bed. The bed is soft.', hasAudio: true },
  { id: 'l1-09', level: 1, title: 'A Fish', content: 'A fish swims in water. It has fins.', hasAudio: true },
  { id: 'l1-10', level: 1, title: 'The Tree', content: 'A tree is tall. It has green leaves.', hasAudio: true },
];

const level2Passages: Passage[] = [
  { id: 'l2-01', level: 2, title: 'Morning Walk', content: 'Every morning I walk to school. The path goes through a small park with tall trees and singing birds.', hasAudio: true },
  { id: 'l2-02', level: 2, title: 'The Library', content: 'The library is a quiet place. I like to read books about animals and far away places.', hasAudio: true },
  { id: 'l2-03', level: 2, title: 'My Garden', content: 'We have a garden behind our house. Mom grows tomatoes and I help water the flowers.', hasAudio: true },
  { id: 'l2-04', level: 2, title: 'The Beach', content: 'Last summer we went to the beach. I built a sandcastle and found pretty shells.', hasAudio: true },
  { id: 'l2-05', level: 2, title: 'Rain Day', content: 'When it rains I stay inside. I like to watch the drops race down the window.', hasAudio: true },
  { id: 'l2-06', level: 2, title: 'My Friend', content: 'My best friend lives next door. We ride bikes together and share our snacks.', hasAudio: true },
  { id: 'l2-07', level: 2, title: 'The Zoo', content: 'At the zoo I saw lions and zebras. The monkeys made funny faces at us.', hasAudio: true },
  { id: 'l2-08', level: 2, title: 'Breakfast', content: 'For breakfast I eat toast with jam. Dad makes the best scrambled eggs.', hasAudio: true },
  { id: 'l2-09', level: 2, title: 'Night Sky', content: 'At night I look at the stars. The moon glows bright like a silver coin.', hasAudio: true },
  { id: 'l2-10', level: 2, title: 'The Puppy', content: 'Our new puppy is small and brown. He likes to chase his tail around.', hasAudio: true },
  { id: 'l2-11', level: 2, title: 'Winter Snow', content: 'Snow covers the ground in winter. We build snowmen and have snowball fights.', hasAudio: true },
  { id: 'l2-12', level: 2, title: 'The Kitchen', content: 'Mom cooks dinner in the kitchen. The smell of fresh bread fills the house.', hasAudio: true },
  { id: 'l2-13', level: 2, title: 'School Bus', content: 'The yellow bus picks me up each day. I sit with my friend near the back.', hasAudio: true },
  { id: 'l2-14', level: 2, title: 'Art Class', content: 'In art class we paint with bright colors. I made a picture of my family.', hasAudio: true },
  { id: 'l2-15', level: 2, title: 'The Farm', content: 'Grandpa has a farm with cows and chickens. I help collect eggs every summer.', hasAudio: true },
];

const level3Passages: Passage[] = [
  { id: 'l3-01', level: 3, title: 'The Tortoise and the Hare', content: 'A hare once laughed at a slow tortoise. The tortoise challenged him to a race. The hare ran fast then took a nap. The tortoise kept going and won the race. Slow and steady wins the race.', author: 'Aesop', hasAudio: true },
  { id: 'l3-02', level: 3, title: 'The Fox and the Grapes', content: 'A hungry fox saw grapes hanging high on a vine. He jumped and jumped but could not reach them. Finally he walked away saying the grapes were probably sour anyway.', author: 'Aesop', hasAudio: true },
  { id: 'l3-03', level: 3, title: 'Twinkle Star', content: 'Twinkle, twinkle, little star, how I wonder what you are. Up above the world so high, like a diamond in the sky. When the blazing sun is gone, when he nothing shines upon.', author: 'Jane Taylor', hasAudio: true },
  { id: 'l3-04', level: 3, title: 'The Wind', content: 'Who has seen the wind? Neither I nor you. But when the leaves hang trembling, the wind is passing through. Who has seen the wind? Neither you nor I. But when the trees bow down their heads, the wind is passing by.', author: 'Christina Rossetti', hasAudio: true },
  { id: 'l3-05', level: 3, title: 'The Ant and the Grasshopper', content: 'All summer the ant worked hard storing food. The grasshopper played and sang in the sun. When winter came the ant had plenty to eat. The hungry grasshopper learned that it is best to prepare for days of need.', author: 'Aesop', hasAudio: true },
  { id: 'l3-06', level: 3, title: 'The Lion and the Mouse', content: 'A lion caught a little mouse. The mouse begged for mercy and promised to help the lion someday. The lion laughed but let him go. Later the mouse freed the lion from a hunters net. Little friends may prove to be great friends.', author: 'Aesop', hasAudio: true },
  { id: 'l3-07', level: 3, title: 'Bed in Summer', content: 'In winter I get up at night and dress by yellow candle light. In summer quite the other way, I have to go to bed by day. I have to go to bed and see the birds still hopping on the tree.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-08', level: 3, title: 'The Crow and the Pitcher', content: 'A thirsty crow found a pitcher with water at the bottom. His beak could not reach it. He dropped pebbles into the pitcher one by one. The water rose until he could drink. Necessity is the mother of invention.', author: 'Aesop', hasAudio: true },
  { id: 'l3-09', level: 3, title: 'Rain', content: 'The rain is raining all around. It falls on field and tree. It rains on the umbrellas here and on the ships at sea. From house to house the rain goes too and falls on me and you.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-10', level: 3, title: 'The Boy Who Cried Wolf', content: 'A shepherd boy cried wolf to trick the villagers. They came running but found no wolf. He did it again and again. When a real wolf came no one believed him. Nobody believes a liar even when he tells the truth.', author: 'Aesop', hasAudio: true },
  { id: 'l3-11', level: 3, title: 'The Swing', content: 'How do you like to go up in a swing, up in the air so blue? Oh, I do think it the pleasantest thing ever a child can do! Up in the air and over the wall, till I can see so wide.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-12', level: 3, title: 'The Dog and His Shadow', content: 'A dog carrying meat crossed a bridge over a stream. He saw his reflection and thought it was another dog with bigger meat. He snapped at the reflection and lost his own meat in the water. Greed often leads to loss.', author: 'Aesop', hasAudio: true },
  { id: 'l3-13', level: 3, title: 'My Shadow', content: 'I have a little shadow that goes in and out with me. And what can be the use of him is more than I can see. He is very, very like me from the heels up to the head. And I see him jump before me when I jump into my bed.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-14', level: 3, title: 'The North Wind', content: 'The North Wind doth blow and we shall have snow. And what will the robin do then, poor thing? He will sit in a barn and keep himself warm and hide his head under his wing, poor thing.', author: 'Traditional', hasAudio: true },
  { id: 'l3-15', level: 3, title: 'The Goose and Golden Eggs', content: 'A farmer had a goose that laid golden eggs. He grew greedy and killed the goose to get all the gold at once. Inside he found nothing. He lost his daily golden egg forever. Those who want too much often lose everything.', author: 'Aesop', hasAudio: true },
  { id: 'l3-16', level: 3, title: 'Time to Rise', content: 'A birdie with a yellow bill hopped upon the window sill. Cocked his shining eye and said, Aint you shamed, you sleepy head? The morning sun is bright and warm. Rise and greet the brand new morn.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-17', level: 3, title: 'The Bundle of Sticks', content: 'A father gave his quarreling sons a bundle of sticks to break. None could break the bundle. Then he untied it and they easily broke the sticks one by one. United we stand, divided we fall.', author: 'Aesop', hasAudio: true },
  { id: 'l3-18', level: 3, title: 'Foreign Lands', content: 'Up into the cherry tree who should climb but little me? I held the trunk with both my hands and looked abroad on foreign lands. I saw the next door gardens lie, adorned with flowers, before my eye.', author: 'R.L. Stevenson', hasAudio: true },
  { id: 'l3-19', level: 3, title: 'The Town Mouse', content: 'A town mouse visited his cousin in the country. The simple food was boring. He invited the country mouse to town for fine food. But cats and dangers made them run. Better a simple life in peace than luxury with fear.', author: 'Aesop', hasAudio: true },
  { id: 'l3-20', level: 3, title: 'Whole Duty of Children', content: 'A child should always say whats true and speak when he is spoken to. And behave mannerly at table, at least as far as he is able. Be gentle and kind in all you do. This is the whole duty of children.', author: 'R.L. Stevenson', hasAudio: true },
];

export const ALL_PASSAGES: Passage[] = [
  ...level1Passages,
  ...level2Passages,
  ...level3Passages,
];

export function getPassagesByLevel(level: Level): Passage[] {
  return ALL_PASSAGES.filter((p) => p.level === level);
}

export function getPassageById(id: string): Passage | undefined {
  return ALL_PASSAGES.find((p) => p.id === id);
}

export function getNextPassage(level: Level, completedIds: string[]): Passage | undefined {
  const levelPassages = getPassagesByLevel(level);
  return levelPassages.find((p) => !completedIds.includes(p.id));
}
