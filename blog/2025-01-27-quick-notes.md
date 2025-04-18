a few quick notes

<!-- truncate -->

GitLab:
Environment is only for deployment.

<!-- === -->

Weston terminal:
https://manpages.ubuntu.com/manpages/focal/man5/weston.ini.5.html#:~:text=TERMINAL%20SECTION,-Contains%20settings%20for&text=For%20a%20good%20experience%20it,terminal%20font%20(unsigned%20integer).

```conf
[terminal]
font-size=<font-size-value>
```

<!-- === -->

Silence output:

command > /dev/null 2>&1 # both error and standard
command 2> /dev/null # only errors
command > /dev/null or command 1> /dev/null # only standard

<!-- === -->

A CROSS JOIN produces a cartesian product between the two tables, returning all possible combinations of all rows. It has no ON clause because you're just joining everything to everything.

A FULL OUTER JOIN is a combination of a LEFT OUTER and RIGHT OUTER join. It returns all rows in both tables that match the query's WHERE clause, and in cases where the ON condition can't be satisfied for those rows it puts NULL values in for the unpopulated fields.

This wikipedia article explains the various types of joins with examples of output given a sample set of tables.

<!-- === -->

CSS selector Adjacent sibling and general sibling

<!-- === -->

feature A
feature B
All created from main
A rebase from B
Merge B into main
A rebase from main
merge request for A to main -> Rebase conflict
Solution: Merge main into A

<!-- === -->

Publish gitlab pages to different site using the same path

<!-- === -->

Use environment variable in protoc-gen-doc

<!-- === -->

Project: Avahi Wrapper for update_service and update_client_with_interface_changes

<!-- === -->

Clinical Performance

<!-- === -->

backtrack: https://medium.com/@ralph-tech/%E6%BC%94%E7%AE%97%E6%B3%95%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-%E5%9B%9E%E6%BA%AF%E6%B3%95-backtracking-%E5%88%86%E6%94%AF%E5%AE%9A%E7%95%8C%E6%B3%95-branch-and-bound-29165391c377

<!-- === -->

JOIN ON VS Having

https://stackoverflow.com/questions/11366006/mysql-join-on-vs-using

<!-- === -->

The Twelve-Factor App
https://12factor.net/

<!-- === -->

javascript AOT vs JIT

<!-- === -->

system design vs product design

<!-- === -->

Python single thread vs nodejs single thread event loop

<!-- === -->

Python multiple event loop

<!-- === -->

GitLab Configuration as Code: https://github.com/Roche/gitlab-configuration-as-code
