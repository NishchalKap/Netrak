# Repository Migration Plan

## Objective

Reorganize the repository into a clean, production-grade structure while preserving the existing Expo application and its behavior.

## Current Location -> New Location -> Reason

| Current Location | New Location | Reason |
|---|---|---|
| .gemini/antigravity/scratch/NetRak/ | apps/mobile/ | This is the existing Expo app and should be the canonical mobile application. |
| AI_Digital_Public_Safety_Blueprint.md | docs/research/ | Research document should live under the research documentation area. |
| AI_Digital_Public_Safety_System_Architecture.md | docs/architecture/ | Architecture document belongs under the architecture docs area. |
| Digital_Public_Safety_Market_Intelligence_Report.md | docs/research/ | Market research belongs with other research materials. |
| Digital_Public_Safety_Threat_Intelligence_Report.docx | docs/research/ | Threat intelligence report belongs with the research corpus. |
| assets/ | assets/ | Existing asset folder is already in the correct top-level location and should be preserved. |
| src/ | apps/mobile/src/ | Application source belongs under the app root. |
| package.json, tsconfig.json, app.json | apps/mobile/ | Mobile project configuration should live with the app. |
| scripts/ | apps/mobile/scripts/ | Project scripts should remain with the app that uses them. |
| .vscode/ | apps/mobile/.vscode/ | Editor configuration should travel with the app project. |
| .claude/ | apps/mobile/.claude/ | Tooling configuration should remain local to the app project. |
| .gitignore | apps/mobile/.gitignore | Project-level ignore rules should follow the app project. |
| AGENTS.md, CLAUDE.md | apps/mobile/ | Project-local agent instructions should stay with the app. |

## Execution Notes

- Move files instead of recreating them where possible.
- Preserve the Expo app as the single mobile application.
- Keep routing, imports, and config intact.
- Do not implement new features or change business logic.
