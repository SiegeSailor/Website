# LeetCode

Overtime, I found some patterns to solve questions that come with similar requirements and constraints

## Data Structure

Some keywords or concepts found in the question lead to using specific data structures:

- Next Greater/Smaller:
  - Monotonic Stack
- Kth Element:
  - Heap

Some other tips:

- If the two-pointer or dynamic programming solution requires something like `i - 1`, then the table should be initialized as `[0] * n + 1`, and keep `table[0] = 0`

### Quick Select and Quick Sort

### Subarray

#### Suffix and Prefix

#### Kadane's Algorithm

#### Divide and Conquer

#### Prefix Sum (Hashmap O(N))

#### Sliding Window

### Top K Elements

3-Way QuickSelect:

```py
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counter = Counter(nums)
        uniques = list(counter.keys())
        n = len(uniques)
        iTarget = n - k

        def partition(iL, iR):
            iPivot = random.randint(iL, iR)
            # Cache the value before moving it to the end of the list
            pivot = counter[uniques[iPivot]]
            # Move pivot to the end
            uniques[iR], uniques[iPivot] = uniques[iPivot], uniques[iR]

            iLess = iEqual = iL
            iMore = iR
            while iLess <= iEqual <= iMore:
                if counter[uniques[iEqual]] == pivot:
                    iEqual += 1
                    continue
                if counter[uniques[iEqual]] < pivot:
                    uniques[iLess], uniques[iEqual] = uniques[iEqual], uniques[iLess]
                    iEqual += 1
                    iLess += 1
                    continue
                if counter[uniques[iEqual]] > pivot:
                    uniques[iMore], uniques[iEqual] = uniques[iEqual], uniques[iMore]
                    iMore -= 1
                    continue

            return iLess, iMore

        def quickSelect(iL, iR):
            # No room to sort.
            if iL == iR:
                return

            iLess, iMore = partition(iL, iR)
            # We have element with more frequency on the right side. This
            # means we already sorted the list enough for what we need.
            if iLess <= iTarget <= iMore:
                return

            # Go right since `iTarget` lies on the right side
            if iMore < iTarget:
                quickSelect(iMore + 1, iR)
            else:
                quickSelect(iL, iLess - 1)

        quickSelect(0, n - 1)
        return uniques[iTarget:]
```
