export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function formatDateObj(obj: any) {
  const year = obj.$y;
  const month = String(obj.$M + 1).padStart(2, '0'); // $M is zero-indexed
  const day = String(obj.$D).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
