export const CASES = [
  {
    id: 'latarnia', title: 'Zaginiona latarnia', prop: 'latarnię', location: 'Dom na Wzgórzu',
    story: 'Bal kostiumowy miał zacząć się za chwilę. Z przedsionka zniknęła dyniowa latarnia. Były tam tylko trzy osoby. Jedna ją wyniosła. Dokładnie jedna osoba kłamie.',
    question: 'Kto wyniósł latarnię?',
    people: [
      { id: 'ada', name: 'Ada', costume: 'Czarownica', icon: 'hat', quote: 'Leon wyniósł latarnię.', claim: { op: 'is', who: 'leon' } },
      { id: 'leon', name: 'Leon', costume: 'Wampir', icon: 'bat', quote: 'To Mila wyniosła latarnię.', claim: { op: 'is', who: 'mila' } },
      { id: 'mila', name: 'Mila', costume: 'Duch', icon: 'ghost', quote: 'Leon kłamie.', claim: { op: 'false', person: 'leon' } },
    ],
    hints: ['Zestaw zeznania Leona i Mili. Czy mogą jednocześnie mówić prawdę?', 'Zdanie Mili zaprzecza zdaniu Leona. Dokładnie jedno z tej dwójki kłamie.', 'Skoro kłamca jest w tej dwójce, Ada mówi prawdę. Sprawdź, kogo wskazała.'],
    explanation: 'Leon wskazał Milę, a Mila zaprzeczyła jego zeznaniu. Jedno z nich musi kłamać. Ada mówi więc prawdę: latarnię wyniósł Leon. Leon skłamał, a Mila powiedziała prawdę.',
  },
  {
    id: 'klucz', title: 'Klucz do oranżerii', prop: 'klucz', location: 'Stara Oranżeria',
    story: 'W oranżerii czeka niespodzianka dla gości, ale ktoś zabrał jedyny klucz. Mogła to zrobić tylko Ada, Leon albo Mila. Klucz zabrała jedna osoba. Dokładnie jedno zeznanie jest fałszywe.',
    question: 'Kto zabrał klucz?',
    people: [
      { id: 'ada', name: 'Ada', costume: 'Czarownica', icon: 'hat', quote: 'Klucz zabrał Leon.', claim: { op: 'is', who: 'leon' } },
      { id: 'leon', name: 'Leon', costume: 'Wampir', icon: 'bat', quote: 'Ada nie zabrała klucza.', claim: { op: 'not', who: 'ada' } },
      { id: 'mila', name: 'Mila', costume: 'Duch', icon: 'ghost', quote: 'Klucz zabrał Leon albo ja.', claim: { op: 'any', who: ['leon', 'mila'] } },
    ],
    hints: ['Sprawdź osobno każdą z trzech możliwości. Policz fałszywe zeznania.', 'Gdyby klucz zabrała Ada, wszyscy troje skłamaliby. Gdyby zabrał go Leon, wszyscy mówiliby prawdę.', 'Pozostaje Mila. Przy tej możliwości tylko zeznanie Ady jest fałszywe.'],
    explanation: 'Przy Adzie otrzymalibyśmy trzy kłamstwa, a przy Leonie ani jednego. Tylko Mila pasuje do warunku dokładnie jednego kłamcy: Ada wskazała niewłaściwą osobę, Leon i Mila powiedzieli prawdę.',
  },
  {
    id: 'cukierki', title: 'Ostatnia miska cukierków', prop: 'cukierki', location: 'Sala Balowa',
    story: 'Pora na finał balu! Ze stołu zniknęła ostatnia miska cukierków. W sali byli Ada, Leon, Mila i Olek. Jedna z tych osób schowała miskę. Dokładnie jedna osoba kłamie.',
    question: 'Kto schował cukierki?',
    people: [
      { id: 'ada', name: 'Ada', costume: 'Czarownica', icon: 'hat', quote: 'Cukierki schował Olek.', claim: { op: 'is', who: 'olek' } },
      { id: 'leon', name: 'Leon', costume: 'Wampir', icon: 'bat', quote: 'Mila kłamie.', claim: { op: 'false', person: 'mila' } },
      { id: 'mila', name: 'Mila', costume: 'Duch', icon: 'ghost', quote: 'Cukierki schował Leon albo Olek.', claim: { op: 'any', who: ['leon', 'olek'] } },
      { id: 'olek', name: 'Olek', costume: 'Kot', icon: 'cat', quote: 'Ada nie schowała cukierków.', claim: { op: 'not', who: 'ada' } },
    ],
    hints: ['Leon zaprzecza słowom Mili. Co wynika z tego przy tylko jednym kłamcy?', 'Jedno z tej dwójki kłamie. Ada i Olek muszą więc mówić prawdę.', 'Ada wskazała Olka. Przy tej możliwości Mila mówi prawdę, więc kłamie Leon.'],
    explanation: 'Zdania Leona i Mili wzajemnie sobie zaprzeczają. Kłamcą jest zatem jedno z nich, a Ada i Olek mówią prawdę. Ada wskazała Olka. Zeznanie Mili jest wtedy prawdziwe, a Leon kłamie.',
  },
];

export function truthTable(puzzle, culprit) {
  const evaluate = (claim, seen = new Set()) => {
    if (claim.op === 'is') return culprit === claim.who;
    if (claim.op === 'not') return culprit !== claim.who;
    if (claim.op === 'any') return claim.who.includes(culprit);
    if (claim.op === 'false') {
      if (seen.has(claim.person)) throw new Error('Circular statement');
      const person = puzzle.people.find(p => p.id === claim.person);
      if (!person) throw new Error('Unknown witness');
      return !evaluate(person.claim, new Set([...seen, claim.person]));
    }
    throw new Error('Unknown statement');
  };
  return puzzle.people.map(person => ({ ...person, truth: evaluate(person.claim, new Set([person.id])) }));
}
export function solutions(puzzle) {
  return puzzle.people.flatMap(person => {
    const liars = truthTable(puzzle, person.id).filter(p => !p.truth);
    return liars.length === 1 ? [{ culprit: person.id, liar: liars[0].id }] : [];
  });
}
export function verdict(puzzle, culprit, liar) {
  return solutions(puzzle).some(s => s.culprit === culprit && s.liar === liar);
}
export function formatTime(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
