// src/utils/catchAsync.js

/**
 * catchAsync — Wrapper للـ Async Functions في Express
 *
 * المشكلة اللي بيحلها:
 *   لو عندك async function في Express وحصل error جوّاها،
 *   Express مش هيمسك الـ error تلقائياً.
 *   هتحتاج تحط try/catch في كل Controller Function.
 *
 *   بدل ما تكتب كده في كل function:
 *
 *     export const placeOrder = async (req, res, next) => {
 *       try {
 *         // ... الكود
 *       } catch (err) {
 *         next(err);  // ← لازم تكتبها في كل مكان
 *       }
 *     };
 *
 *   بتكتب كده:
 *
 *     export const placeOrder = catchAsync(async (req, res, next) => {
 *       // ... الكود بدون try/catch
 *       // لو حصل error → catchAsync بيبعته لـ next تلقائياً
 *     });
 *
 * إزاي بيشتغل:
 *   - بياخد الـ async function كـ argument
 *   - بيرجع function جديدة بتستدعيها
 *   - لو الـ Promise اتكسرت → .catch(next) بيمسك الـ error
 *   - الـ error بيروح للـ Global Error Handler في Express
 *
 * الاستخدام:
 *   import catchAsync from "../utils/catchAsync.js";
 *   export const myFunction = catchAsync(async (req, res, next) => {
 *     // كودك هنا
 *   });
 */

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

      // export default catchAsync;
module.exports = catchAsync;