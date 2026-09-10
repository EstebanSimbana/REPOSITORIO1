import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = pathToFileURL(path.join(projectRoot, "index.html")).href;

const viewports = [
  { name: "mobile-320", width: 320, height: 700 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 }
];

function formatAxeViolations(violations) {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => `    - ${node.target.join(", ")}: ${node.failureSummary}`)
        .join("\n");

      return `${violation.id} (${violation.impact}): ${violation.help}\n${nodes}`;
    })
    .join("\n\n");
}

test("HTML semantico y atributos ARIA estan completos", async ({ page }) => {
  await page.goto(siteUrl);

  const issues = await page.evaluate(() => {
    const errors = [];
    const one = (selector, label) => {
      const count = document.querySelectorAll(selector).length;
      if (count !== 1) {
        errors.push(`${label}: se esperaba 1 y se encontro ${count}`);
      }
    };

    one("header", "header semantico");
    one("main#contenido", "contenido principal");
    one("footer", "footer semantico");
    one("h1", "titulo h1 unico");

    if (!document.querySelector(".skip-link[href='#contenido']")) {
      errors.push("falta skip-link hacia el contenido principal");
    }

    if (!document.querySelector("nav[aria-label]")) {
      errors.push("la navegacion principal necesita nombre accesible");
    }

    document.querySelectorAll("main section[id]").forEach((section) => {
      const headingId = section.getAttribute("aria-labelledby");
      const heading = headingId ? document.getElementById(headingId) : null;

      if (!headingId || !heading || !/^H[1-6]$/.test(heading.tagName)) {
        errors.push(`la seccion #${section.id} debe estar etiquetada por un encabezado existente`);
      }
    });

    document.querySelectorAll("[aria-controls]").forEach((control) => {
      const targetId = control.getAttribute("aria-controls");
      if (!targetId || !document.getElementById(targetId)) {
        errors.push(`aria-controls apunta a un id inexistente: ${targetId}`);
      }
    });

    document.querySelectorAll("[aria-expanded], [aria-pressed]").forEach((control) => {
      ["aria-expanded", "aria-pressed"].forEach((attribute) => {
        const value = control.getAttribute(attribute);
        if (value !== null && value !== "true" && value !== "false") {
          errors.push(`${attribute} debe ser true o false`);
        }
      });
    });

    if (!document.querySelector("[aria-live='polite']")) {
      errors.push("el panel interactivo debe anunciar cambios con aria-live='polite'");
    }

    return errors;
  });

  expect(issues).toEqual([]);
});

test("enlaces externos y recursos usan patrones seguros", async ({ page }) => {
  await page.goto(siteUrl);

  const issues = await page.evaluate(() => {
    const errors = [];
    const externalUrl = (value) => {
      try {
        return new URL(value, window.location.href);
      } catch {
        return null;
      }
    };

    document.querySelectorAll("a[href], img[src], script[src], link[href]").forEach((element) => {
      const rawUrl = element.getAttribute("href") || element.getAttribute("src");
      const url = externalUrl(rawUrl);

      if (url && ["http:", "https:"].includes(url.protocol) && url.protocol !== "https:") {
        errors.push(`${element.tagName.toLowerCase()} usa una URL no segura: ${rawUrl}`);
      }
    });

    document.querySelectorAll("a[href^='http']").forEach((anchor) => {
      const url = externalUrl(anchor.getAttribute("href"));
      const relValues = (anchor.getAttribute("rel") || "").toLowerCase().split(/\s+/);
      const opensNewTab = anchor.getAttribute("target") === "_blank";
      const visibleText = anchor.textContent.replace(/\s+/g, " ").trim().toLowerCase();

      if (url?.protocol !== "https:") {
        errors.push(`el enlace externo debe usar https: ${anchor.getAttribute("href")}`);
      }

      if (!opensNewTab) {
        errors.push(`el enlace externo debe declarar target="_blank": ${anchor.getAttribute("href")}`);
      }

      if (!relValues.includes("noopener") || !relValues.includes("noreferrer")) {
        errors.push(`target="_blank" debe incluir rel="noopener noreferrer": ${anchor.getAttribute("href")}`);
      }

      if (!visibleText.includes("abre en nueva pestaña")) {
        errors.push(`el enlace externo debe avisar visiblemente que abre nueva pestaña: ${anchor.getAttribute("href")}`);
      }
    });

    return errors;
  });

  expect(issues).toEqual([]);
});

for (const viewport of viewports) {
  test(`WCAG AA y responsive en ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(siteUrl);

    const accessibilityScan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScan.violations, formatAxeViolations(accessibilityScan.violations)).toEqual([]);

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth
    }));

    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.bodyWidth).toBeLessThanOrEqual(layout.viewportWidth + 1);

    const menuToggle = page.locator(".menu-toggle");
    const siteNav = page.locator("#site-nav");

    if (viewport.width <= 720) {
      await expect(menuToggle).toBeVisible();
      await expect(siteNav).toBeHidden();
      await expect(menuToggle).toHaveAttribute("aria-expanded", "false");

      await menuToggle.click();
      await expect(siteNav).toBeVisible();
      await expect(menuToggle).toHaveAttribute("aria-expanded", "true");

      await page.keyboard.press("Escape");
      await expect(siteNav).toBeHidden();
      await expect(menuToggle).toHaveAttribute("aria-expanded", "false");
    } else {
      await expect(menuToggle).toBeHidden();
      await expect(siteNav).toBeVisible();
    }
  });
}
