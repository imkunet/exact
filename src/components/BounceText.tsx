import { Component, For, onMount } from 'solid-js';
import { spring } from 'motion';
import { Motion } from '@motionone/solid';

type BounceTextProps = {
  class: string;
  text: string;
  initialDelay?: number;
  stagger?: number;
} & Partial<typeof defaultProps>;

const defaultProps = {
  initialDelay: 0,
  stagger: 0.014
};

const BounceText: Component<BounceTextProps> = (propsIn) => {
  const props = { ...defaultProps, ...propsIn };

  let i = 0;
  onMount(() => {
    i = 0;
  });

  return (
    <p class={props.class}>
      <For each={props.text.split(' ')}>
        {(word) => (
          <>
            <span class="inline-block">
              <For each={word.split('')}>
                {(char) => (
                  <Motion.span
                    class="inline-block"
                    initial={{ x: -25, y: 45, scale: 0.4, rotate: -2, opacity: 0 }}
                    animate={{ x: 0, y: 0, scale: 1.0, rotate: 0, opacity: 1 }}
                    transition={{
                      easing: spring({ damping: 14, stiffness: 160 }),
                      delay: props.initialDelay + i++ * props.stagger
                    }}
                  >
                    {char}
                  </Motion.span>
                )}
              </For>
            </span>
            <span> </span>
          </>
        )}
      </For>
    </p>
  );
};

export default BounceText;
