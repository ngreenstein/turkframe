# Turkframe

Turkframe is a PsiTurk wrapper for use around separately hosted experiments.

PsiTurk makes Mechanical Turk integration easier, but it can be time-consuming to adapt projects for use with PsiTurk. Turkframe eases the process of adding PsiTurk to an existing project with minimal modification.

## How It Works

Turkframe provides a 'wrapper' PsiTurk project to handle mTurk integration. When a worker is ready to begin the task, Turkframe simply produces an iframe pointing towards a separately hosted experiment. PsiTurk's `condition`, `counterbalance`, and `uniqueId` parameters are passed to the experiment, and the experiment can freely pass messages and data back to the PsiTurk frame.

## What's Included

- The `turkframe` PsiTurk project, as a template to be customized and pointed towards your experiment
- The `turkframe.js` JavaScript API, to help separately hosted experiments communicate with Turkframe/PsiTurk

## Getting Started

1. Modify the `turkframe` PsiTurk project's config files, templates, styles, etc. to suit your needs.
2. Customize the inline script in `templates/exp.html` to point Turkframe towards your experiment and register any custom message handlers.
3. Include a copy of the `turkframe.js` API in your experiment.
4. From your experiment, you may call `Turkframe.messageUp()` to send custom messages to your handlers.
5. From your experiment, call `Turkframe.messageFinished()` when ready to hand control back to PsiTurk.
