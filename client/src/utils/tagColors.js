export const getTagColor = (tag) => {
  const colors = {
    CEN: "blue",
    CIT: "green",
    CABHA: "yellow",
    CAS: "purple",
    CAG: "red",
  }
  return colors[tag] || "gray"
}

