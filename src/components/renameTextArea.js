import { handleKeyDown, useClickOutside } from "../utils/lib.js";
import { useRef, forwardRef } from "react";

export const RenameTextArea = forwardRef(
  ({ defaultValue, confirmAction, classes, isPressEnterToSubmit }, ref) => {
    const textAreaRef = useRef();
    useClickOutside(textAreaRef, confirmAction);

    return (
      <div ref={textAreaRef}>
        <textarea
          ref={ref}
          name="input"
          defaultValue={defaultValue}
          autoFocus
          rows="1"
          className={classes}
          onKeyDown={(event) => {
            if (isPressEnterToSubmit) {
              handleKeyDown(event, confirmAction, confirmAction);
            } else {
              handleKeyDown(event, () => {}, confirmAction);
            }
          }}
          onFocus={(event) => {
            adjustHeight(event.currentTarget, 28);
          }}
          onChange={(event) => {
            adjustHeight(event.currentTarget, 28);
          }}
        ></textarea>
      </div>
    );
  }
);

//Credits for textArea adjustHeight
//http://bdadam.com/blog/automatically-adapting-the-height-textarea.html
function adjustHeight(el, minHeight) {
  // compute the height difference which is caused by border and outline
  const outerHeight = parseInt(window.getComputedStyle(el).height, 10);
  const diff = outerHeight - el.clientHeight;

  // set the height to 0 in case of it has to be shrinked
  el.style.height = 0;

  // set the correct height
  // el.scrollHeight is the full height of the content, not just the visible part
  el.style.height = Math.max(minHeight, el.scrollHeight + diff) + "px";
}
