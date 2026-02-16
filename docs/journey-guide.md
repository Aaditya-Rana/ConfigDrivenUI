# Journey Creation Guide

This guide explains how to create and manage dynamic onboarding journeys using the Strapi backend.

## Core Concepts

- **Screen**: A single step in the flow.
    - **Question**: User input (Single Select, Multi Select, Text, Number).
    - **Info**: Static message or content.
    - **Summary**: End state or result screen.
- **Transition**: Logic that determines the *next* screen based on the user's answer.
- **Journey**: The container that defines the entry point (`startScreen`).

## Question Types

When creating a `Question` block, you can choose from the following types:

| Type | Description | Output Format |
| :--- | :--- | :--- |
| `single_choice` | User selects one option from a list. | String (e.g., `"us"`) |
| `multiple_choice` | User selects multiple options. | Array of Strings (e.g., `["coding", "design"]`) |
| `text` | Free text input. | String |
| `number` | Numeric input. | Number |

## Transitions & Logic Operators

Transitions determine the flow. You define a **Field** (variable name), an **Operator**, and a **Value**.

### Supported Operators

| Operator | Description | Compatible Types | Example |
| :--- | :--- | :--- | :--- |
| `equals` | Exact match. | String, Number, Boolean | `region` equals `us` |
| `not_equals` | Does not match. | String, Number, Boolean | `region` not_equals `us` |
| `contains` | **For Arrays**: Checks if array contains value.<br>**For Strings**: Checks substring. | Multi-select, String | `interests` contains `coding` |
| `not_contains` | **For Arrays**: Checks if array *excludes* value. | Multi-select, String | `interests` not_contains `design` |
| `in` | Checks if user answer is in a list of allowed values (comma-separated). | Single Select, String | `language` in `en,es,fr` |
| `not_in` | Checks if user answer is NOT in a list. | Single Select, String | `country` not_in `us,ca,uk` |
| `greater_than` | Strict inequality (>). | Number | `experience` greater_than `5` |
| `less_than` | Strict inequality (<). | Number | `age` less_than `18` |
| `greater_than_or_equal` | Inequality (>=). | Number | `experience` greater_than_or_equal `2` |
| `less_than_or_equal` | Inequality (<=). | Number | `score` less_than_or_equal `10` |
| `starts_with` | String starts with prefix. | String | `zip_code` starts_with `90` |
| `ends_with` | String ends with suffix. | String | `email` ends_with `@gmail.com` |

## Creating a Journey Flow

1.  **Draft Your Screens**:
    *   Go to **Content Manager** -> **Screens**.
    *   Create all the screens you need (Start, Questions, Results).
    *   *Tip: Create them first without transitions, then link them later.*

2.  **Configure Questions**:
    *   Add `shared.question` blocks to your screens.
    *   **Crucial**: Remember the `variableName` (e.g., `experience_years`, `tech_stack`). This is the key you will use in transitions.

3.  **Define Transitions**:
    *   Open a Screen that needs logic.
    *   Add **Transitions**.
    *   **Field**: Must match the `variableName` of the question (or a previous question).
    *   **Operator**: Select the logic.
    *   **Value**: The value to compare against.
    *   **Target Screen**: Where to go if True.

4.  **Create the Journey Entry**:
    *   Go to **Content Manager** -> **Journeys**.
    *   Create a new Journey (e.g., "Developer Onboarding").
    *   Link the **Start Screen**.

5.  **Publish**:
    *   Ensure all **Screens** and the **Journey** are published.

## Example Flows

### 1. Multi-Select Logic
*   **Question**: "What are your interests?" (`interests`) -> Multi-choice: [`coding`, `design`, `business`]
*   **Transition 1**: Field `interests` **contains** `coding` -> Go to "Coding Quiz"
*   **Transition 2**: Field `interests` **contains** `design` -> Go to "Design Portfolio"
*   **Fallback**: (If typical flow) You might set a default transition or ensure logic covers all cases.

### 2. Numeric logic
*   **Question**: "Years of experience?" (`yoe`) -> Number
*   **Transition 1**: Field `yoe` **greater_than_or_equal** `5` -> Go to "Senior Roles"
*   **Transition 2**: Field `yoe` **less_than** `5` -> Go to "Junior Roles"
