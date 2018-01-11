# Turkframe

Turkframe is a PsiTurk wrapper for use around separately hosted experiments.

PsiTurk makes Mechanical Turk integration easier, but it can be time-consuming to adapt projects for use with PsiTurk. Turkframe eases the process of using PsiTurk for mTurk integration while requiring minimal modifications to existing experiments.

## How It Works

Turkframe provides a 'wrapper' PsiTurk project to handle mTurk integration. When a worker is ready to begin the task, Turkframe simply produces an iframe pointing towards a separately hosted experiment. PsiTurk's `condition`, `counterbalance`, and `uniqueId` parameters are passed to the experiment, and the experiment can freely pass data and events back to the PsiTurk frame.

## What's Included

- The `turkframe` PsiTurk project, as a template to be customized and pointed towards your experiment
- The `turkframe.js` JavaScript API, to help separately hosted experiments communicate with Turkframe/PsiTurk

## Getting Started

1. Modify the `turkframe` PsiTurk project's config files, templates, styles, etc. to suit your needs.
2. Modify the `experimentUrl` variable in `turkframe/static/js/task.js` to point towards your experiment.
3. Include `turkframe.js` in your experiment.
4. Add any necessary communication between PsiTurk and your experiment using `Turkframe.getPsiTurkData()`, `Turkframe.messageUp()`, and adding to the the `switch` statement in `task.js`.
5. From your experiment, call `Turkframe.messageFinished()` when ready to hand control back to PsiTurk.