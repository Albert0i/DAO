### Little Man 

A little man is *continuously* watching for `in_tray` and `out_tray`: 

```
in_tray: 
.-----------------------------------------.
|id | content |source|timestamp|completed |
'-----------------------------------------'

out_tray: 
.-----------------------------------------.
|id | content |target|timestamp|completed |
'-----------------------------------------'
```

1. If entries are found on `out_tray`, it is sent to target immediately; 

2. If entries are found on `in_tray`, it is processed immediately; 

3. Entries are mark `completed = true` upon finish; 

4. If target can't be reached, `retry_polocy` is applied; Upon failure, `error_log` is written and `completed = true` accordingly. 

5. If errors occurred while processing `in_tray`, `error_log` is written and `completed = true` accordingly. 


### EOF (2024/09/06)
