/**
 * @file  �I���e�L�X�g�ł��̃t�@�C����Grep
 *
 * �����V���[�g�J�b�g�L�[: Alt+G
 */

var selection = Editor.GetSelectedString();

// 0x6300: �����R�[�h�����I�� ���@�\���Ȃ��̂Ŗ����I�ɕ����R�[�h���w�肷��
// ==> �������������R�[�h���w�肷��I�v�V�������@�\���Ă��Ȃ�
//var charCode = ({0: 0x0000, 4: 0x0400})[Editor.GetCharCode()];
// ==> �����R�[�h�������ʃI�v�V�������g��
// ==> ���̃I�v�V�������@�\���Ă��Ȃ�
Editor.Grep(selection, Editor.ExpandParameter('$f'),
	Editor.ExpandParameter('$e'), 0x64+0x10+0x02/*�ҏW���̃e�L�X�g���猟��(������)*/);
//	charCode);
