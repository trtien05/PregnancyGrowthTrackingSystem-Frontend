import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

export default function useDocumentTitle(title) {
  useIsomorphicLayoutEffect(() => {
    window.document.title = title
  }, [title])
}
