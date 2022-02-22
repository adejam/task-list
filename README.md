# TASK APP

This is a task app that can be used to keep record of tasks. It consumes the [task-list-api-endpoint](https://pwg-task-list-api.herokuapp.com/api/tasks/) whose code can be found at [task-list-api](https://github.com/adejam/task-list-api.git)

## Technologies used

- React
- Typescript
- Axios
- React-sortable-hoc
- Array-move

## Features

- Get all tasks.
- Create a task.
- update a task label using autosave feature and debounce hooks.
- update task sort order.
- update task completed status.

## Live Demo
[Live Demo](https://ja-task-app.netlify.app/)

## Setup the project locally (Running locally)

-   Clone the project

```bash
git clone https://github.com/adejam/task-list.git

```

-   Install Dependencies

```bash
yarn install
```

- Start local server

```bash
yarn start
```

To check for linter errors (Stylelint and Eslint)
```bash
npm run lint:check
```

- To Run linters (Stylelint and Eslint)
```bash
npm run lint
```

## @Todo

- Improve on styling, especially on different screens and overall UI feel
- React-sortable-hoc is deprecated in new versions of react. I works fine now but might cause issues in the future. Currently looking into React-DND-kit as a replacement.
- Add functionality to delete task
- Add functionality to switch `allow_duplicates` setting