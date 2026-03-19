// ══════════════════════════════════════════════
// APP INIT — runs after all other scripts load
// ══════════════════════════════════════════════

renderSteps();
renderCards();
renderTimeline();
renderStepsPreview();
renderCardsPreview();
renderTimelinePreview();

// Apply default background colours to preview viewports
document.getElementById('stepsPreview').style.background = selectedStepsBg;
document.getElementById('cardsPreview').style.background = selectedCardsBg;
document.getElementById('timelinePreview').style.background = selectedTimelineBg;
