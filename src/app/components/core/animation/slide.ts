import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

const ANIMATION_TRANSITION = `0.2s cubic-bezier(0.25, 1, 0.33, 1)`;

export const slideMotion: AnimationTriggerMetadata = trigger('slideMotion', [
  state(
    'bottom',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
      transformOrigin: '0% 0%'
    })
  ),
  state(
    'top',
    style({
      opacity: 1,
      transform: 'scaleY(1)',
      transformOrigin: '0% 100%'
    })
  ),
  transition('void => bottom', [
    style({
      opacity: 0,
      transform: 'scaleY(0.8)',
      transformOrigin: '0% 0%'
    }),
    animate(ANIMATION_TRANSITION)
  ]),
  transition('bottom => void', [
    animate(
      ANIMATION_TRANSITION,
      style({
        opacity: 0,
        transform: 'scaleY(0.8)',
        transformOrigin: '0% 0%'
      })
    )
  ]),
  transition('void => top', [
    style({
      opacity: 0,
      transform: 'scaleY(0.8)',
      transformOrigin: '0% 100%'
    }),
    animate(ANIMATION_TRANSITION)
  ]),
  transition('top => void', [
    animate(
      ANIMATION_TRANSITION,
      style({
        opacity: 0,
        transform: 'scaleY(0.8)',
        transformOrigin: '0% 100%'
      })
    )
  ])
]);
