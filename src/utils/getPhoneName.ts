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
      return {
        name: "Xiaomi 13 Ultra",
        got: true,
      }
    case "2203121C":
      return {
        name: "Xiaomi 12S Ultra",
        got: true,
      }
    case "M2002J9E":
      return {
        name: "Xiaomi Mi 10 Youth",
        got: true,
      }
    default:
      return {
        name: code,
        got: false,
      }
  }
}
