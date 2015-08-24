/**
 * Every component and region has a set of abilities registered to them. You can view them from
 * their respective API page. You can customize these abilities to suit your game needs.
 *
 * Every ability support the following customization:
 *
 * -   You can enable / disable the ability by setting the attribute of the component / region. For
 *     example:
 *
 *     ```html
 *     <pb-c-token pickable="false">
 *     ```
 *
 *     That makes the token non pickable.
 *
 * -   You can change the trigger for each ability by setting the attribute of the component /
 *     region with a `-on` prefix. For example:
 *
 *     ```html
 *     <pb-c-token pickable-on="pb-key-p">
 *     ```
 *
 *     That sets the token to be picked when the user hovers over the token and presses `p`. Look at
 *     classes extending {{#crossLink "trigger.Trigger"}}{{/crossLink}} for more triggers.
 *
 * More additional customizations, check out the ability's API page.
 *
 * @class 04 Customizing Components
 * @module tutorial
 */
