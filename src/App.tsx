import { Motion } from '@motionone/solid';
import { spring } from 'motion';
import { Component, createSignal } from 'solid-js';
import BounceText from './components/BounceText';

const App: Component = () => {
  const pad = (input: number, length: number) => ('0'.repeat(length) + input).slice(-length);
  const getTimeFormat = (date: Date) => {
    return `${pad(date.getHours() == 0 ? 12 : date.getHours() % 12, 2)}:${pad(
      date.getMinutes(),
      2
    )}:${pad(date.getSeconds(), 2)} ${pad(date.getMilliseconds(), 3)} ${
      date.getHours() > 12 ? 'PM' : 'AM'
    }`;
  };

  const [timeText, setTimeText] = createSignal(getTimeFormat(new Date()));
  const [error, setError] = createSignal('Synchronizing clock...');
  const [timezone, setTimezone] = createSignal('');

  const getTime = async () => {
    const response = await fetch('https://time.kunet.workers.dev/');
    return await response.text();
  };

  let lastUpdated = Date.now();

  let fetching = false;
  let foundTime = false;
  let offset = 0;

  const updateTime = () => {
    const now = new Date(Date.now() + offset);
    setTimeText(getTimeFormat(now));
  };

  const attemptFetchTime = async () => {
    if (fetching) return;
    fetching = true;

    lastUpdated = Date.now();
    // wake up!
    await getTime();

    const samples = 3;
    let averageOffset = 0;
    let averageError = 0;

    for (let i = 0; i < samples; i++) {
      const startTime = Date.now();
      const timeResponse = await getTime();
      const endTime = Date.now();

      const response = parseInt(timeResponse);
      const middleTime = (startTime + endTime) / 2;

      const offset = response - middleTime;
      averageOffset += offset;
      averageError += endTime - startTime;
    }

    foundTime = true;
    offset = averageOffset / samples;
    setError(
      `Your clock is ${
        (Math.sign(-offset) == -1 ? '' : '+') + (-offset / 1000).toFixed(4)
      }s inaccurate \u00b1${(averageError / samples / 1000 / 2).toFixed(4)}s`
    );

    const zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zoneOffset = new Date().getTimezoneOffset() / 60;
    setTimezone(`${zoneName} (UTC${Math.sign(zoneOffset) == -1 ? '-' : '+'}${zoneOffset})`);

    fetching = false;

    updateTime();
  };

  attemptFetchTime();

  const frame = () => {
    if (Math.abs(lastUpdated - Date.now()) > 30000) attemptFetchTime();
    if (!foundTime) return requestAnimationFrame(frame);
    updateTime();
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);

  return (
    <div class="container max-w-6xl mx-auto mt-4 p-8">
      <BounceText class="text-8xl font-semibold text-white" text="Exact" stagger={0.045} />
      <BounceText
        class="text-4xl font-semibold text-slate-400"
        text="Figure out your exact time today!"
        initialDelay={0.4}
      />
      <Motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ easing: spring({ damping: 15, stiffness: 160 }), delay: 1.5 }}
      >
        <h1 class="text-center text-4xl text-slate-400 mt-32">the exact time is</h1>
        <h1 class="text-center text-7xl mt-2 font-mono">{timeText()}</h1>
        <h1 class="text-center text-4xl text-slate-400 mt-2">{error()}</h1>
        <h1 class="text-center text-3xl text-slate-400 mt-2">{timezone()}</h1>
      </Motion.div>
    </div>
  );
};

export default App;
