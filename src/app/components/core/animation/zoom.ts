import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

const ANIMATION_TRANSITION = '0.2s cubic-bezier(0.08, 0.81, 0.17, 1)';

export const zoomBigMotion: AnimationTriggerMetadata = trigger('zoomBigMotion', [
  transition('void => *', [
    style({ opacity: 0, transform: 'scale(0.8)' }),
    animate(
      ANIMATION_TRANSITION,
      style({
        opacity: 1,
        transform: 'scale(1)',
      }),
    ),
  ]),
  transition('* => void', [
    style({ opacity: 1, transform: 'scale(1)' }),
    animate(
      ANIMATION_TRANSITION,
      style({
        opacity: 0,
        transform: 'scale(0.8)',
      }),
    ),
  ]),
]);
