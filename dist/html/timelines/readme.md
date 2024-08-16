# To use timeline in presentation

1. Copy JSON file and make corrections
1. Load in slide like so:
    ```html
    <section data-background-iframe="./static/interactive/timelines/timeline.html?file=example.json">
    </section>
    ```
1. Tune settings
    1. Set URL query params like `?initial_zoom=3` or `?hash_bookmark=false`

To link to a specific event in the timeline, use hash:
```html
<section data-background-iframe="./static/interactive/timelines/timeline.html?file=example.json#event-the-early-years">
</section>
```