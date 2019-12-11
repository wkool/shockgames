# shockgame

This repository contains code for the Moral versions of the Daw and Kool two-step tasks used in the following publication:

> Patil, I., Zucchelli, M. M., Kool, W., Campbell, S., Fornasier, F., Calo', M., Silani, G., Cikara, M., & Cushman, F. A. (2019). Reasoning supports utilitarian resolutions to moral dilemmas across diverse measures. Journal of Personality and Social Psychology. [doi: 10.1037/pspp0000281](https://psyarxiv.com/q86vx/)

This code has been written by <b>Stephanie Campbell</b>, based on code by Wouter Kool.

These directories contain the code for running the doors-and-buttons versions of the Daw and Kool two-step paradigms online.

Both experiments have been written using Josh deLeeuw's `jsPsych` toolbox (http://www.jspsych.org/).

In order to save the data, you will need to be able to connect to a SQL database on your server. The code has some default names for the tables it stores data in (e.g., `shockgame_daw_data`, `shockgame_daw_subinfo`, `shockgame_daw_subid`), but feel free to change anything about the way the data storage is managed.
