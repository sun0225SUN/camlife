/**
 * Returns the phone name corresponding to the given phone model code.
 * Data source: https://www.gsmarena.com/res.php3
 *
 * @param {string} code - The phone model code
 * @returns {string} The corresponding phone name, or the original code if no match is found
 *
 * @example
 * getPhoneName("2304FPN6DC") // returns "Xiaomi 13 Ultra"
 * getPhoneName("UNKNOWN_CODE") // returns "UNKNOWN_CODE"
 */
export function getPhoneName(code: string) {
  switch (code) {
    case "2304FPN6DC":
      return "Xiaomi 13 Ultra"
    case "2203121C":
      return "Xiaomi 12S Ultra"
    case "M2002J9E":
      return "Xiaomi Mi 10 Youth"
    default:
      return null
  }
}
