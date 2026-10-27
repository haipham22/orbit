import { describe, expect, it } from "vitest";
import { addDays, daysUntilBirthday, formatDateShort } from "./dates";

describe("daysUntilBirthday", () => {
  it("trả 0 khi sinh nhật hôm nay", () => {
    expect(daysUntilBirthday("1990-10-27", new Date(2026, 9, 27))).toBe(0);
  });

  it("đếm đúng ngày trong tương lai cùng năm", () => {
    expect(daysUntilBirthday("1990-11-01", new Date(2026, 9, 27))).toBe(5);
  });

  it("wrap sang năm sau khi sinh nhật đã qua", () => {
    expect(daysUntilBirthday("1990-01-10", new Date(2026, 9, 27))).toBe(75);
  });

  it("xử lý 29/2 qua năm không nhuận", () => {
    expect(daysUntilBirthday("2000-02-29", new Date(2027, 1, 20))).toBe(9);
  });
});

describe("formatDateShort", () => {
  it("định dạng dd/mm/yyyy", () => {
    expect(formatDateShort("2026-10-27")).toBe("27/10/2026");
  });
});

describe("addDays", () => {
  it("cộng ngày trong cùng tháng", () => {
    expect(addDays("2026-10-27", 5)).toBe("2026-11-01");
  });

  it("cộng qua năm", () => {
    expect(addDays("2026-12-30", 5)).toBe("2027-01-04");
  });

  it("ngày âm", () => {
    expect(addDays("2026-10-02", -5)).toBe("2026-09-27");
  });
});
