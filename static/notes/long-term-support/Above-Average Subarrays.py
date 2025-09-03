# Above-Average Subarrays
# You are given an array A containing N integers. Your task is to find all subarrays whose average sum is greater than the average sum of the remaining array elements. You must return the start and end index of each subarray in sorted order.
# A subarray that starts at position L1 and ends at position R1 comes before a subarray that starts at L2 and ends at R2 if L1 < L2, or if L1 = L2 and R1 ≤ R2.
# Note that we'll define the average sum of an empty array to be 0, and we'll define the indicies of the array (for the purpose of output) to be 1 through N. A subarray that contains a single element will have L1 = R1.
# Signature
# Subarray[] aboveAverageSubarrays(int[] A)
# Input
# 1 ≤ N ≤ 2,000
# 1 ≤ A[i] ≤ 1,000,000
# Output
# A Subarray is an object with two integer fields, left and right, defining the range that a given subarray covers. Return a list of all above-average subarrays sorted as explained above.
# Example 1
# A = [3, 4, 2]
# output = [[1, 2], [1, 3], [2, 2]]
# The above-average subarrays are [3, 4], [3, 4, 2], and [4].


def bruteForce(A):
    result = []

    for i in range(0, len(A)):
        for j in range(i, len(A)):
            subarray = A[i : j + 1]
            m = sum(A[i : j + 1]) / len(subarray)
            if len(subarray) == len(A):
                result.append([i + 1, j + 1])
                continue

            am = sum(A[0:i] + A[j + 1 : len(A)]) / (len(A) - len(subarray))
            if m > am:
                result.append([i + 1, j + 1])
    return result


def aboveAverageSubarrays(A):
    result = []

    prefix = [0] * (len(A) + 1)
    for i, v in enumerate(A):
        prefix[i + 1] = prefix[i] + v

    for i in range(0, len(A)):
        for j in range(i, len(A)):
            subarray_len = j - i + 1
            remaining_len = len(A) - subarray_len
            if remaining_len == 0:
                result.append([i + 1, j + 1])
                continue
            # `j+1` because we want to include the j value
            # in prefix since prefix[i] = prefix[i - 1] + A[i]
            # And prefix is 1-indexed
            subarray_sum = prefix[j + 1] - prefix[i]
            m = subarray_sum / subarray_len
            am = (prefix[-1] - subarray_sum) / remaining_len
            if m > am:
                result.append([i + 1, j + 1])
    return result


print(aboveAverageSubarrays([3, 4, 2]))  # [[1, 2], [1, 3], [2, 2]]
# [0,3,7,9]
