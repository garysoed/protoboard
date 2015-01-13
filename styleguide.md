# General
- Col width = 100
- Line break before operators
- __privateSymbols__
- on* for handlers
- Imports should be sorted alphabetically by the name of the class. If any of the directories has 
more than 1 classes, group them by directories. The `from` at for every group should be aligned.
- In any class, `this` should always refer to that class.
- Symbols have to be sorted alphabetically
- Sections: 
  - Imports
  - Class JSDoc
  - Private Constants
  - Symbols
  - Public Globals
  - Class
    - Constructor
    - Private methods
    - Public Methods
    - Getters and Setters
  - Public Constants
  - Public Static Methods
- All attributes have to be private. They can only be exposed publicly through getters and setters.
- String constants have to be refered by reference only.

# JS Doc styles


# Tests
- Use KarmaJS HTML format
- Class names in describe should be namespaced
- 'use strict'
- The entire test script must be scoped
- Ordering should be: before, beforeEach, describe / it, afterEach after
- For every describe, it should start with positive case, then the negative cases of those. If there
are multiple positive cases, do the negative cases of the first case before proceeded to the next
one.
- The it line should be one line. It is not restricted to 100 cols long.
- Empty line between the describes
- No empty line between the its
- Constant names should not refer to the constant variable.
