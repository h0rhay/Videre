# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo. We use the defaults verbatim.

| Canonical role     | Label in this repo  | Meaning                                  |
| ------------------ | ------------------- | ---------------------------------------- |
| `needs-triage`     | `needs-triage`      | Maintainer needs to evaluate this issue  |
| `needs-info`       | `needs-info`        | Waiting on reporter for more information |
| `ready-for-agent`  | `ready-for-agent`   | Fully specified, ready for an AFK agent  |
| `ready-for-human`  | `ready-for-human`   | Requires human implementation            |
| `wontfix`          | `wontfix`           | Will not be actioned                     |

Ralph adds one more terminal state used after autonomous completion:

| Canonical role     | Label in this repo  | Meaning                                  |
| ------------------ | ------------------- | ---------------------------------------- |
| `done`             | `done`              | Implemented, verified, committed         |

When a skill mentions a role, use the corresponding label string from these tables. Categories are `bug` or `enhancement`; apply one per issue alongside the state role.
