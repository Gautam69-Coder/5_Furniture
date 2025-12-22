export const slugify = (text) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")       // Replace spaces with -
        .replace(/[^\w-]+/g, "");   // Remove special characters
}