export const handleKeyDown = (event, confirmAction, cancelAction) => {
  if (event.key === "Escape") cancelAction();
  else if (event.key === "Enter") confirmAction(event);
};

export async function asyncCatch(callback, ...args) {
  try {
    await callback(...args);
  } catch (error) {
    console.log("An error occured while updating");
    console.log(error);
  }
}
